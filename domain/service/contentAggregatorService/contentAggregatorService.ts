import Post from "./post";

export default interface ContentAggregatorService {
  fetchLastPosts(): Promise<Post[]>;
}
