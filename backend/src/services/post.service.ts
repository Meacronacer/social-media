import PostModel, { IPost } from "../models/Post";
import UserModel from "../models/User";
import CommentModel from "../models/Comment";
import { FilterQuery, ObjectId, Types } from "mongoose";

class PostService {
  // Создание поста
  async createPost(authorId: string | ObjectId, text: string): Promise<IPost> {
    // Создаём пост
    const post = await PostModel.create({ author: authorId, text });
    // Добавляем пост в список пользователя
    await UserModel.findByIdAndUpdate(authorId, { $push: { posts: post._id } });
    // Выполняем populate для поля author (получаем только необходимые поля)
    const populatedPost = await PostModel.findById(post._id)
      .populate('author', 'first_name second_name img_url')
      .exec();
    return populatedPost as IPost;
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
  // PostService.ts
  async toggleLike(postId: string, userId: string): Promise<IPost | null> {
    const post = await PostModel.findById(postId);

    if (!post) return null;

    const userObjectId = new Types.ObjectId(userId);
    const isLiked = post.likes.some((id) => id.equals(userObjectId));

    if (isLiked) {
      post.likes = post.likes.filter((id) => !id.equals(userObjectId));
    } else {
      post.likes.push(userObjectId);
    }

    await post.save();

    const updatedPost = await PostModel.findById(postId)
      .populate("author", "first_name second_name img_url")
      .populate({
        path: "comments",
        populate: { path: "author", select: "first_name second_name img_url" },
      });

    return updatedPost;
  }
}

export default new PostService();
