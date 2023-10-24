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
