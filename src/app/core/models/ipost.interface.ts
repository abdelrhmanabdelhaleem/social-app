export interface IPostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface ICommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface ITopComment {
  _id: string;
  content: string;
  commentCreator: IPostUser;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
}

export interface IPost {
  _id: string;
  body: string;
  image?: string;
  privacy: string;
  user: IPostUser;
  sharedPost: any;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment?: ITopComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface IPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: IPost[];
  };
}
