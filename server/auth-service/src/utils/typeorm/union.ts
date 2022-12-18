import { SelectQueryBuilder } from 'typeorm';

export interface UnionParameters {
  getQuery: () => string;
  getParameters: () => any;
}

export function union<T>(
  initialQueryBuilder: SelectQueryBuilder<T>,
  ...queries: SelectQueryBuilder<T>[]
): UnionParameters {
  const stringfyQuery = (
    query: SelectQueryBuilder<T>,
    queryBuilder: SelectQueryBuilder<T>,
  ): UnionParameters => {
    const sql = `(${queryBuilder.getQuery()})`;

    return {
      getQuery: () => `${query.getQuery()} UNION ${sql}`,
      getParameters: () => ({
        ...queryBuilder.getParameters(),
        ...query.getParameters(),
      }),
    };
  };

  const { getQuery, getParameters } = queries.reduce(
    stringfyQuery,
    initialQueryBuilder,
  );

  return {
    getQuery: () => `(${getQuery()})`,
    getParameters,
  };
}
