export default interface User {
  id: string;
  username: string | null;
  discriminator: string | null;
  avatar: string | null;
}
