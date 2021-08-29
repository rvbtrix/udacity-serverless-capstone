
/**
 * Retorna o mock de um query DynamoDB
 *
 * @param result
 */
export const mockQuery = (result: any) => ({
    eq: () => mockQuery(result),
    in: () => mockQuery(result),
    and: () => mockQuery(result),
    where: () => mockQuery(result),
    between: () => mockQuery(result),
    gt: () => mockQuery(result),
    filter: () => mockQuery(result),
    parallel: () => mockQuery(result),
    startAt: () => mockQuery(result),
    exec: () => Promise.resolve(result)
} as any);
