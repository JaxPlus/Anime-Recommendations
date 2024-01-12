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
    status: number;
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
    status: number;
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
    status: number;
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
    status: number;
};

export type { QueryRecommendation };

type ErrorType = {
    isErrorPresent: boolean;
    errorMessage: string;
};

export type { ErrorType };
