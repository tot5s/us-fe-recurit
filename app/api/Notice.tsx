import { fetchWithAuth } from "@/lib/auth"

const fe = "https://fe-assignment-api.us-insight.com"

const GetContentsListFn = async ({page, limit, status, category, publish_status}: {page: number, limit: number, status: string, category: string, publish_status: string}) => {

    const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status,
    category,
    publish_status,
  })

  return fetchWithAuth(`${fe}/api/v1/contents?${params}`, {
    method: "GET",
  })
}


const CreateContentsFn = async({body, categories, link_url, title}: {
    body: string,
    categories: string[],
    link_url: string,
    title: string
}) => {

    const categoriesString = categories.join(',');
    
    const params = new URLSearchParams({
        body,
        categories: categoriesString,
        link_url,
        title
    })

    return fetchWithAuth(`${fe}/api/v1/contents`, {
        method: "POST",
        body: params
    })

}

const GetContentsDetailFn = async({
    id,
}: {
   id: string
}) => {
    const params = new URLSearchParams({
        id
    })

    return fetchWithAuth(`${fe}/api/v1/contents?${params}`, {
        method: "GET"
    })
}

const PutContentsDetail = async({
    id,
    body,
    categories,
    link_url,
    title
}: {
    id: string,
    body: string,
    categories: string[]
    link_url: string,
    title: string
}) => {
    const categoriesString = categories.join(',');

    const params = new URLSearchParams({
        id,
        body,
        categories: categoriesString,
        link_url,
        title
    })

    return fetchWithAuth(`${fe}/api/v1/contents`, {
        method: "PUT",
        body: params
    })
}


// 콘텐츠 발행 관련
const GetContentsNoticeFn = async({
    id
}: {
    id: string
}) => {
    const params = new URLSearchParams({
        id
    })

    return fetchWithAuth(`${fe}/api/v1/contents${id}/notification`, {
        method: "GET"
    })
}

const GetContentsSceduleFn = async({
    id
}: {
    id: string
}) => {
    const params = new URLSearchParams({
        id
    })

    return fetchWithAuth(`${fe}/api/v1/contents/${id}/schedule`, {
        method: "GET"
    })
}

const PutContentsSceduleFn = async({
    id,
    published_at
}: {
    id: string
    published_at: string
}) => {
    const params = new URLSearchParams({
        published_at
    })

    return fetchWithAuth(`${fe}/api/v1/contents/${id}/schedule`, {
        method: "PUT",
        body: params
    })

}

const SetContentsSceduleFn = async({
    id,
    published_at
}: {
    id: string,
    published_at: string
}) => {
    
    const params = new URLSearchParams({
        published_at
    })

    return fetchWithAuth(`${fe}/api/v1/contents/${id}/schedule`, {
        method: "POST",
        body: params
    })
}

const DelContnentsSceduleFn = async({
    id
}: {
    id: string
}) =>{

    return fetchWithAuth(`${fe}/api/v1/contents/${id}/schedule`, {
        method: "DELETE",
    })
}

export {
    GetContentsListFn,
    CreateContentsFn,
    GetContentsDetailFn,
    PutContentsDetail,
    GetContentsNoticeFn,
    GetContentsSceduleFn,
    PutContentsSceduleFn,
    SetContentsSceduleFn,
    DelContnentsSceduleFn
    
}