export default class UseCaseNotFound extends Error {
  byCommand(command: string) {
    return new UseCaseNotFound(`Use case for command "${command}" not found`);
  }
}
