import PostModel, { IPost } from "../models/Post";
import UserModel from "../models/User";
import CommentModel from "../models/Comment";
import { FilterQuery, ObjectId, Types } from "mongoose";

class PostService {
  // Создание поста
  async createPost(authorId: string | ObjectId, text: string): Promise<IPost> {
    const post = await PostModel.create({ author: authorId, text });
    await UserModel.findByIdAndUpdate(authorId, { $push: { posts: post._id } });
    return post;
  }

  // Получение всех постов с автором и комментариями
  // Возвращает посты автора, созданные раньше, чем lastCreatedAt (если он передан)
  // Если lastCreatedAt не передан, возвращает последние посты.
  async getPostsPaginated(
    userId: string,
    limit: number = 5,
    lastCreatedAt?: Date
  ): Promise<{ posts: IPost[]; hasMore: boolean }> {
    const query: FilterQuery<IPost> = { author: userId };

    if (lastCreatedAt) {
      query.createdAt = { $lt: lastCreatedAt };
    }

    const posts = await PostModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate("author", "first_name second_name img_url")
      .populate({
        path: "comments",
        populate: [
          { path: "author", select: "first_name second_name img_url" },
        ],
      });

    const hasMore = posts.length > limit;

    return {
      posts: hasMore ? posts.slice(0, limit) : posts,
      hasMore,
    };
  }

  // post delete
  async deletePost(postId: string, userId: string): Promise<boolean> {
    const post = await PostModel.findById(postId);
    if (!post) return false;

    if (post.author.toString() !== userId) return false;

    await CommentModel.deleteMany({ _id: { $in: post.comments } });
    await UserModel.findByIdAndUpdate(userId, { $pull: { posts: postId } });
    await PostModel.findByIdAndDelete(postId);
    return true;
  }

  // post edit
  async updatePost(
    postId: string,
    userId: string | ObjectId,
    text: string
  ): Promise<IPost | null> {
    const post = await PostModel.findById(postId);
    if (!post) return null;
    // Проверяем, что автор поста совпадает с запрашивающим
    if (post.author.toString() !== userId) return null;
    post.text = text;
    await post.save();
    return post;
  }

  // Лайк/анлайк поста
  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const post = await PostModel.findById(postId);
    if (!post) return false;

    const likedIndex = post.likes.findIndex((id) => id.toString() === userId);
    if (likedIndex > -1) {
      post.likes.splice(likedIndex, 1);
    } else {
      post.likes.push(new Types.ObjectId(userId));
    }

    await post.save();
    return true;
  }
}

export default new PostService();
