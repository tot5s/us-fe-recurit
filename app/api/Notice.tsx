import { fetchWithAuth } from "@/lib/auth"

const fe = "https://fe-assignment-api.us-insight.com"

const GetContentsListFn = async ({
  page,
  limit,
  status,
  category,
  publish_status,
}: {
  page: number
  limit: number
  status?: string
  category?: string
  publish_status?: string
}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(status && { status }),
    ...(category && { category }),
    ...(publish_status && { publish_status }),
  })

  const res = fetchWithAuth(`${fe}/api/v1/contents?${params}`, {
    method: "GET",
  })

  const data = (await res).json()
  return data
}


const CreateContentsFn = async({body, categories, link_url, title}: {
    body: string,
    categories: string[],
    link_url: string,
    title: string
}) => {


    const res = await fetchWithAuth(`${fe}/api/v1/contents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body,
      categories,
      title,
      link_url,
    }),
  })

  if (!res.ok) {
    const message = await res.text().catch(() => "")
    throw new Error(message || `콘텐츠 생성에 실패했습니다. (HTTP ${res.status})`)
  }
  const data = await res.json()

  return data
}

const GetContentsDetailFn = async({
    id,
}: {
   id: string
}) => {
    const params = new URLSearchParams({
        id
    })

    const res = await fetchWithAuth(`${fe}/api/v1/contents?${params}`, {
        method: "GET",
         headers: {
      "Content-Type": "application/json",
    },
    })

    if (!res.ok) {
        throw new Error(`콘텐츠 조회에 실패했습니다. (HTTP ${res.status})`)
    }

    return res.json()
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
    return fetchWithAuth(`${fe}/api/v1/contents/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            id,
            body,
            categories,
            link_url,
            title,
        }),
    })
}


// 콘텐츠 발행 관련
const GetContentsNoticeFn = async({
    id
}: {
    id: string
}) => {

    const res = fetchWithAuth(`${fe}/api/v1/contents/${id}/notification`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    })

    const data = (await res).json()
    return data
}

const GetContentsSceduleFn = async({
    id,
    
}: {
    id: string,
    
}) => {

    const res = await fetchWithAuth(`${fe}/api/v1/contents/${id}/schedule`, {
        method: "GET",
         headers: {
            "Content-Type": "application/json",
        }
    })

    if(!res.ok) return

    const data = res.json()
    return data
}

const PathContentSceduleFn = async({
    id,
    status 
}: {
    id: string,
    status: string
}) => {

    return fetchWithAuth(`${fe}/api/v1/contents/${id}/status`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status
        })
    })
}
const PutContentsSceduleFn = async({
    id,
    published_at
}: {
    id: string
    published_at: string
}) => {
    const match = published_at.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?/)
    if (!match) {
        throw new Error("예약 시간 형식이 올바르지 않습니다.")
    }
    const formattedPublishedAt = `${match[1]}T${match[2]}:${match[3] ?? "00"}`

    return fetchWithAuth(`${fe}/api/v1/contents/${id}/schedule`, {
        method: "PUT",
        body: JSON.stringify({
            published_at: formattedPublishedAt
        })
    })
}

const SetContentsSceduleFn = async({
    id,
    published_at
}: {
    id: string,
    published_at: string
}) => {
    


    return fetchWithAuth(`${fe}/api/v1/contents/${id}/schedule`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            published_at
        })
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


// 알람 설정

const GetNotificationFn = async ({
    page,
    limit,
    status,
    target_type,
    send_status
}: {
    page: number,
    limit: number,
    status?: string,
    target_type?: string;
    send_status?: string;
}) => {

    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(status && { status }),
        ...(target_type && { target_type }),
        ...(send_status && { send_status }),
    })

    return fetchWithAuth(`${fe}/api/v1/notifications?${params}`, {
        method: "GET",
    })
}

const SetNotificationFn = async({
    content_id,
    scheduled_at,
    target_type,
    title
} : {
    content_id: number;
    scheduled_at: string;
    target_type: string;
    title: string
}) => {

    const res = await fetchWithAuth(`${fe}/api/v1/notifications`, {
        method: "POST",
        headers: {
      "Content-Type": "application/json",
    },
        body: JSON.stringify({
            content_id,
            scheduled_at,
            target_type,
            title
        })
    })

    return res
}

const GetNotificationDetailFn = async({id} : {
    id: string
}) => {
    const res = await fetchWithAuth(`${fe}/api/v1/notifications/${id}`, {
        method: "GET",
        headers: {
      "Content-Type": "application/json",
        },
    })
    if (!res.ok) throw new Error(`알람 상세 조회에 실패했습니다. (HTTP ${res.status})`)
    return res.json()
}

const PutNotificationDetailFn = async({
    id,
    content_id,
    target_type,
    title
}: {
    id: string,
    content_id: number,
    target_type: string,
    title: string
}) => {
    
    return fetchWithAuth(`${fe}/api/v1/notifications/${id}`, {
        method: "PUT",
        headers: {
      "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content_id,
            target_type,
            title,
        }),
    })
}

const DelNotificationDetailFn = async({
    id
}: {
    id: number
}) => {
    
    return fetchWithAuth(`${fe}/api/v1/notifications/${id}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        }
    })
}

const GetNotificationScheduleFn = async({
    id
}: {
    id: string
}) =>{
    
    const res = await fetchWithAuth(`${fe}/api/v1/notifications/${id}/schedule`,{
        method: "GET",
        headers: {
      "Content-Type": "application/json",
        },
    })

    if (!res.ok) throw new Error(`알람 예약 조회에 실패했습니다. (HTTP ${res.status})`)
    return res.json()
}

const PutNotificationScheduleFn = async({
    id,
    scheduled_at
}: {
    id: string;
    scheduled_at: string
}) => {

    return fetchWithAuth(`${fe}/api/v1/notifications/${id}/schedule`, {
        method: "PUT",
        headers: {
      "Content-Type": "application/json",
        },
        body: JSON.stringify({ scheduled_at }),
    })
}

const SetNotificationScheduleFn = async({
    id,
    scheduled_at
}: {
    id: string;
    scheduled_at: string;
}) => {

    return fetchWithAuth(`${fe}/api/v1/notifications/${id}/schedule`, {
        method: "POST",
        headers: {
      "Content-Type": "application/json",
    },
        body: JSON.stringify({ scheduled_at })
    })
}

export {
    GetContentsListFn,
    CreateContentsFn,
    GetContentsDetailFn,
    PathContentSceduleFn,
    PutContentsDetail,
    GetContentsNoticeFn,
    GetContentsSceduleFn,
    PutContentsSceduleFn,
    SetContentsSceduleFn,
    DelContnentsSceduleFn,
    
    GetNotificationFn,
    SetNotificationFn,
    GetNotificationDetailFn,
    PutNotificationDetailFn,
    DelNotificationDetailFn,
    GetNotificationScheduleFn,
    PutNotificationScheduleFn,
    SetNotificationScheduleFn,
}
