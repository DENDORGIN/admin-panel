import {useQuery} from "@tanstack/react-query";
import { ItemsService } from "../client";

export const useAvailableCategories = () => {
    return useQuery({
        queryKey: ["items-categories"],
        queryFn: async () => {
            const res = await ItemsService.readItemsCategories()
            return res.categories // ["Angels", "Buddy", "Animals", ...]
        },
    })
}
