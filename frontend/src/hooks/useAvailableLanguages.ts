import {useQuery} from "@tanstack/react-query";
import { ItemsService } from "../client";

export const UseAvailableLanguages = () => {
    return useQuery({
        queryKey: ["items-languages"],
        queryFn: async () => {
            const res = await ItemsService.readItemsLanguages()
            return res.languages // напр., ["pl", "en", "de", "ua"]
        },
    })
}