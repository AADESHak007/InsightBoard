import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { Category } from '@prisma/client';

// GET - Fetch forum posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const whereClause = {
      isActive: true,
      ...(category && category !== 'All' && { category: category as Category })
    };

    const orderByClause = {
      [sortBy]: sortOrder as 'asc' | 'desc'
    };

    const [posts, totalCount] = await Promise.all([
      prisma.forumPost.findMany({
        where: whereClause,
        include: {
          votes: true,
          comments: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
          },
          _count: {
            select: {
              votes: true,
              comments: true
            }
          }
        },
        orderBy: orderByClause,
        take: limit,
        skip: offset
      }),
      prisma.forumPost.count({
        where: whereClause
      })
    ]);

    // Calculate net votes for each post
    const postsWithVotes = posts.map(post => {
      const upvotes = post.votes.filter(vote => vote.voteType === 'UP').length;
      const downvotes = post.votes.filter(vote => vote.voteType === 'DOWN').length;
      
      return {
        ...post,
        upvotes,
        downvotes,
        netVotes: upvotes - downvotes
      };
    });

    return NextResponse.json({
      success: true,
      data: postsWithVotes,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch forum posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new forum post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author, category } = body;

    // Validate required fields
    if (!title || !content || !author || !category) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: title, content, author, and category are required' 
        },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['PUBLIC_SAFETY', 'TRANSPORTATION', 'HEALTH', 'EDUCATION', 'HOUSING', 'ENVIRONMENT', 'BUSINESS', 'ECONOMY'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid category. Must be one of: ' + validCategories.join(', ') 
        },
        { status: 400 }
      );
    }

    const post = await prisma.forumPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        category: category as Category,
        upvotes: 0,
        downvotes: 0
      },
      include: {
        votes: true,
        comments: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        upvotes: 0,
        downvotes: 0,
        netVotes: 0
      },
      message: 'Post created successfully'
    });

  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create forum post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
