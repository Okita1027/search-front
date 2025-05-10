import myAxios from "@/plugins/myAxios";
import { ApiResponse, Article, ArticleDetailVO, ArticleVO, PostSearchParams } from "@/types";

/**
 * 获取文章列表（搜索页）
 * @param params - 请求参数
 * @returns 文章列表
 */
const getPostList = async (params: PostSearchParams): Promise<ApiResponse<ArticleVO[]>> => {
  return await myAxios.get("/post", { params });
};

/**
 * 获取文章列表（后台管理系统）
 * @return 文章列表（完整字段的数据）
 */
const getPostListAll = async (): Promise<ApiResponse<Article[]>> => {
  return await myAxios.get("/post/list");
}

/**
 * 获取文章详情
 * @param params - 请求参数（文章标题）
 * @returns 文章详情
 */
const getPostDetail = async (params: { text: string }): Promise<ApiResponse<ArticleDetailVO>> => {
  return await myAxios.get("/post/detail", { params });
};

/**
 * 获取文章搜索建议
 * @param suggestText - 搜索文本
 * @returns 搜索建议列表
 */
const getPostSuggestion = async (suggestText: string): Promise<ApiResponse<string[]>> => {
  return await myAxios.get("/post/suggestion", {
    params: { suggestText }
  });
};

/**
 * 新增文章
 * @param articleVO - 文章数据
 * @returns 新增结果
 */
const addPost = async (articleVO: ArticleVO): Promise<ApiResponse<string>> => {
  return await myAxios.post("/post", articleVO);
}

/**
 * 更新文章
 * @param article - 文章数据
 * @returns 更新结果
 */
const updatePost = async (article: Article): Promise<ApiResponse<string>> => {
  return await myAxios.put("/post", article);
}


export default {
  getPostList,
  getPostListAll,
  getPostDetail,
  getPostSuggestion,
  addPost,
  updatePost,
};