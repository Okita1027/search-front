import myAxios from '@/plugins/myAxios';
import { ApiResponse, Post, PostDetail, PostSearchParams, AddCommentParams } from '@/types';

/**
 * 获取文章列表
 * @param params - 请求参数
 * @returns 文章列表
 */
const getPostList = async (params: PostSearchParams): Promise<ApiResponse<Post[]>> => {
  return await myAxios.get('/post', { params });
};

/**
 * 获取文章详情
 * @param params - 请求参数（文章标题）
 * @returns 文章详情
 */
const getPostDetail = async (params: { text: string }): Promise<ApiResponse<PostDetail>> => {
  return await myAxios.get('/post/detail', { params });
};

/**
 * 获取文章搜索建议
 * @param suggestText - 搜索文本
 * @returns 搜索建议列表
 */
const getPostSuggestion = async (suggestText: string): Promise<ApiResponse<string[]>> => {
  return await myAxios.get('/post/suggestion', {
    params: { suggestText }
  });
};

/**
 * 添加文章评论
 * @param params - 评论参数
 * @returns 操作结果
 */
const addPostComment = async (params: {
  postId: string, 
  content: string,
  parentUsername?: string | null,
  parentNickname?: string | null
}): Promise<ApiResponse<boolean>> => {
  return await myAxios.post('/post/comment', params);
};

export default {
  getPostList,
  getPostDetail,
  getPostSuggestion,
  addPostComment
}; 