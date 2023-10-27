type FuzzyDateInt = {
    seasonYear: number | null;
};

type QueryRes = {
    data: {
        data: {
            Page: {
                media: Array<{
                    title: { english: string; romaji: string };
                    description: string;
                    coverImage: { medium: string };
                    generes: Array<string>;
                }>;
            };
        };
    };
};

export type { QueryRes };

type QueryPageIndex = {
    data: {
        data: {
            Page: {
                media: Array<{
                    seasonYear: FuzzyDateInt;
                }>;
            };
        };
    };
};

export type { QueryPageIndex };
