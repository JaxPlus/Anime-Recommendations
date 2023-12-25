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

type QueryAnimeName = {
    data: {
        data: {
            Media: {
                id: number;
                title: {
                    english: string;
                    romaji: string;
                };
            };
        };
    };
};

export type { QueryAnimeName };

type QueryRecommendation = {
    data: {
        data: {
            Page: {
                recommendations: Array<{
                    mediaRecommendation: {
                        title: {
                            english: string;
                            romaji: string;
                        };
                        description: string;
                        coverImage: {
                            medium: string;
                        };
                    };
                }>;
            };
        };
    };
};

export type { QueryRecommendation };
