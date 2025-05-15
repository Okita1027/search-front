import { ApiResponse } from "@/types";
import myAxios from "@/plugins/myAxios";

/**
 * 获取所有评论列表
 * @returns 评论列表
 */
const getAllComments = async (): Promise<ApiResponse<any>> => {
  try {
    return await myAxios.get('/comment');
  } catch (error) {
    console.error("获取评论列表失败:", error);
    return {
      code: 500,
      message: '获取评论列表失败',
      data: []
    };
  }
};

/**
 * 删除评论
 * @param id 评论ID
 * @returns 操作结果
 */
const deleteComment = async (id: number): Promise<ApiResponse<any>> => {
  try {
    return await myAxios.delete('/comment', { params: { id } });
  } catch (error) {
    console.error("删除评论失败:", error);
    return {
      code: 500,
      message: '删除评论失败',
      data: null
    };
  }
};

export default {
  getAllComments,
  deleteComment,
} 