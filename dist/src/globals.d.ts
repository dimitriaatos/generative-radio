export namespace state {
    const debugging: boolean;
    const allPlayers: Set<any>;
    const freesound: FreeSound;
    function ontrigger(): void;
}
export namespace defaults {
    namespace element {
        namespace search {
            namespace options {
                const results: number;
                namespace filter {
                    const duration: number[];
                }
                const sort: string;
            }
        }
        const structure: {};
    }
}
export function initState(): void;
import FreeSound from "freesound-client";
