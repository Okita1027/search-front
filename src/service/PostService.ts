import myAxios from '@/plugins/myAxios';

/**
 * 获取文章列表
 * @param params - 请求参数
 */
const getPostList = async (params: any) => {
  return await myAxios.get('/post', { params });
};

/**
 * 获取文章详情
 * @param params - 请求参数
 */
const getPostDetail = async (params: any) => {
  return await myAxios.get('/post/detail', { params });
};

/**
 * 获取文章搜索建议
 * @param suggestText - 搜索文本
 */
const getPostSuggestion = async (suggestText: string) => {
  return await myAxios.get('/post/suggestion', {
    params: { suggestText }
  });
};

/**
 * 添加文章评论
 * @param params - 评论参数
 */
const addPostComment = async (params: any) => {
  return await myAxios.post('/post/comment', params);
};

export default {
  getPostList,
  getPostDetail,
  getPostSuggestion,
  addPostComment
}; 