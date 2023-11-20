import { useInfiniteQuery } from "@tanstack/react-query";
export const useInfiQuery = (
    name: string[],
    fetchApi: ({
        pageParam,
    }: {
        pageParam?: number | undefined;
    }) => Promise<any>,
    options: any = {}
) => {
    const query = useInfiniteQuery(name, fetchApi, {
        getNextPageParam: (lastPage) =>
            lastPage.has_next ? lastPage.offset + 10 : undefined,
        ...options,
    });

    const loadMore = () => {
        if (query.hasNextPage) query.fetchNextPage();
    };

    const fullData = query.data?.pages.flatMap((page) => page.results);

    return { ...query, loadMore, fullData };
};
