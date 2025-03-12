'use client'

import { useMutation, useQuery } from "convex/react"
import dynamic from "next/dynamic"
import { useMemo } from "react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"

/*interface DocumentIdPageProps {
  params:{
    documentId:Id<'documents'>
  }
}*/ 
//{params}:DocumentIdPageProps <- next js 14v 까지는 params을 동기식으로 접근했지만 15v부터 비동기식으로 접근하도록 변경되어서 이방식을 쓰면 에러 메세지가 뜸
// const params = useParams.. 처럼 useParams 사용하거나 async/await를 사용해야함
export default function DocumentIdPage () {
  const params = useParams<{documentId: Id<'documents'>}>()



  const document = useQuery(api.documents.getById,{
    documentId:params.documentId
  })

  const update = useMutation(api.documents.update)

  const onChange = (content:string) => {
    update({
      id:params.documentId,
      content
    })
  }

  if (document === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]"/>
            <Skeleton className="h-14 w-[80%]"/>
            <Skeleton className="h-14 w-[40%]"/>
            <Skeleton className="h-14 w-[60%]"/>
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not Found</div>
}

return (
    <div className="pb-40">
      
    </div>
)
}