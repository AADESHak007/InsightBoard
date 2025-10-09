import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import type { Prisma, VoteType } from '@prisma/client';

// POST - Vote on a forum post (with atomic transactions)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, voteType } = body;

    // Validate required fields
    if (!userId || !voteType) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: userId and voteType are required' 
        },
        { status: 400 }
      );
    }

    // Validate vote type
    if (!['UP', 'DOWN'].includes(voteType)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid vote type. Must be "UP" or "DOWN"' 
        },
        { status: 400 }
      );
    }

    // Use a transaction with timeout and retry logic
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check if post exists
      const post = await tx.forumPost.findUnique({
        where: { id }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Simple voting: always add a vote (no removal or changing)
      await tx.userVote.create({
        data: {
          postId: id,
          userId: userId,
          voteType: voteType as VoteType
        }
      });

      // Update post vote counts atomically
      const updateData = voteType === 'UP' 
        ? { upvotes: { increment: 1 } }
        : { downvotes: { increment: 1 } };

      await tx.forumPost.update({
        where: { id },
        data: updateData
      });

      const voteResult = { action: 'added', voteType };
      const message = 'Vote added successfully';

      return {
        voteResult,
        message,
        currentUpvotes: post.upvotes,
        currentDownvotes: post.downvotes
      };
    }, {
      timeout: 10000, // 10 second timeout
      maxWait: 5000,  // 5 second max wait
    });

    // Get final vote counts after transaction
    const finalPost = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        votes: true
      }
    });

    const upvotes = finalPost?.votes.filter((vote: { voteType: VoteType }) => vote.voteType === 'UP').length || 0;
    const downvotes = finalPost?.votes.filter((vote: { voteType: VoteType }) => vote.voteType === 'DOWN').length || 0;

      return NextResponse.json({
        success: true,
        data: {
          postId: id,
          upvotes,
          downvotes,
          netVotes: upvotes - downvotes
        },
        result: result.voteResult,
        message: result.message
      });

  } catch (error) {
    console.error('Error voting on post:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Post not found' 
          },
          { status: 404 }
        );
      }
      
      // Handle unique constraint violations (duplicate votes)
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Vote already exists. Please refresh and try again.' 
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to vote on post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
