'use client'	

import {BlockNoteEditor,PartialBlock} from '@blocknote/core'
import {useCreateBlockNote } from '@blocknote/react'
import {BlockNoteView} from '@blocknote/mantine'
import "@blocknote/core/fonts/inter.css";
import '@blocknote/react/style.css'
import '@blocknote/core/style.css'
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes"

import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"

import { useEdgeStore } from "@/lib/edgestore"

interface EditorProps{
  onChange:(value:string) => void
  initialContent?:string
  editable?:boolean
}

function Editor ({onChange,initialContent,editable}:EditorProps) {

  const {resolvedTheme} = useTheme()
  const {edgestore} = useEdgeStore()
  const params = useParams<{documentId: Id<'documents'>}>()

  const handleUpload = async (file:File) => {
    const response = await edgestore.publicFiles.upload({file})

    return response.url
  }

  const editor = useCreateBlockNote({
    initialContent:initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    uploadFile:handleUpload
  });

  editor.onChange((editor) => {
    onChange(JSON.stringify(editor.getBlock, null, 2));
  });


  return (
    <div>
      <BlockNoteView editor={editor} theme={resolvedTheme === 'dark' ? 'dark' : 'light'}/>
    </div>
  )

}

export default Editor