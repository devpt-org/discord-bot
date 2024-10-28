import Post from "../../domain/service/contentAggregatorService/post";
import ContentAggregatorService from "../../domain/service/contentAggregatorService/contentAggregatorService";

interface LemmyPostAuthor {
  display_name: string;
  name: string;
}

interface LemmyPostData {
  featured_community: boolean;
  featured_local: boolean;
  name: string;
  ap_id: string;
  body: string;
  published: string;
}

interface LemmyPost {
  creator: LemmyPostAuthor;
  post: LemmyPostData;
}

interface LemmyApiResponse {
  posts: LemmyPost[];
}

export default class LemmyContentAggregatorService implements ContentAggregatorService {
  private feedUrl = "https://lemmy.pt/api/v3/post/list?community_name=devpt&limit=10&page=1&sort=New";

  async fetchLastPosts(): Promise<Post[]> {
    let unpinnedPosts: Post[] = [];

    try {
      const response = await fetch(this.feedUrl);
      const data: LemmyApiResponse = await response.json();

      unpinnedPosts = data.posts
        .filter((item: LemmyPost) => !item.post.featured_community && !item.post.featured_local)
        .map(
          (item: LemmyPost) =>
            new Post({
              authorName: item.creator.display_name || item.creator.name,
              title: item.post.name,
              link: item.post.ap_id,
              description: item.post.body,
              createdAt: new Date(item.post.published),
            })
        );
    } catch (e) {
      // Ignoring for now.
    }

    return unpinnedPosts;
  }
}
