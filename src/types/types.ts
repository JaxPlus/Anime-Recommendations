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
                    seasonYear: number | null;
                    startDate: {
                        year: number | null;
                    };
                }>;
            };
        };
    };
};

export type { QueryPageIndex };

type QueryRecomm = {
    data: {
        data: {
            Page: {
                recommendations: Array<{
                    media: {
                        coverImage: {
                            medium: string;
                        };
                        genres: Array<string>;
                        title: {
                            english: string;
                            romaji: string;
                        };
                        description: string;
                    };
                    mediaRecommendation: {
                        genres: Array<string>;
                        coverImage: {
                            medium: string;
                        };
                        title: {
                            english: string;
                            romaji: string;
                        };
                        description: string;
                    };
                }>;
            };
        };
    };
};

export type { QueryRecomm };
