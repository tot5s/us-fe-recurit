import { setAuthTokens } from "@/lib/auth"

const fe = "https://fe-assignment-api.us-insight.com"

const GetContentsListFn = async ({page, limit, stats, category, publish_status}: {page: number, limit: number, stats: string, category: string, publish_status: string}) => {

    const res = await fetch(`${fe}/api/v1/contents?page=${page}&limit=${limit}&stats=${stats}$category=${category}&publish_status=${publish_status}`,
        {
            method: 'GET',
            headers: {"Content-Type": "application/json"}, 
        })


        return res

}


export {
    GetContentsListFn
}