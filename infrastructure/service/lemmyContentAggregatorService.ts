import Post from "../../domain/service/contentAggregatorService/post";
import ContentAggregatorService from "../../domain/service/contentAggregatorService/contentAggregatorService";

export default class LemmyContentAggregatorService implements ContentAggregatorService {
  private feedUrl = "https://lemmy.pt/api/v3/post/list?community_name=devpt&limit=10&page=1&sort=New";

  async fetchLastPosts(): Promise<Post[]> {
    let unpinnedPosts = [];

    try {
      const response = await fetch(this.feedUrl);

      const data = await response.json();
  
      unpinnedPosts = data.posts
        .filter((item: any) => !item.post.featured_community && !item.post.featured_local)
        .map(
          (item: any) =>
            new Post({
              authorName: item.creator.display_name || item.creator.name,
              title: item.post.name,
              link: item.post.ap_id,
              description: item.post.body,
              createdAt: new Date(item.post.published),
            })
        );
    } catch (e) {}

    return unpinnedPosts;
  }
}
