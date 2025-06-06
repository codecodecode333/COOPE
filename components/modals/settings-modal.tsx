'use client'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useSettings } from "@/hooks/use-settings"
import { Label } from '@/components/ui/label'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ModeToggle } from '@/components/mode-toggle'
import { toast } from "sonner"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export function SettingsModal() {
  const settings = useSettings()
  const router = useRouter()
  const { workspaceId } = useParams() as { workspaceId: string }

  const id = workspaceId as Id<"workspaces">
  const workspace = useQuery(
    api.workspace.getById,
    id ? { id } : "skip" // ✅ id가 존재할 때만 쿼리 실행
  )

  const updateWorkspace = useMutation(api.workspace.rename)
  const deleteWorkspace = useMutation(api.workspace.remove)

  const [name, setName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (workspace?.name) {
      setName(workspace.name)
    }
  }, [workspace?.name])

  const handleRename = async () => {
    if (!name.trim()) {
      toast.error("Please enter a workspace name.")
      return
    }

    try {
      await updateWorkspace({ id, name })
      toast.success("Workspace name updated.")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update workspace name.")
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteWorkspace({ id })
      toast.success("Workspace deleted.")
      settings.onClose()
      router.push("/")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete workspace.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Workspace Settings</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Coope looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>

        <div className="space-y-2 pt-4">
          <Label htmlFor="name">Workspace Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter workspace name"
          />
          <Button onClick={handleRename} className="mt-2 w-full">
            Update Name
          </Button>
        </div>

        <div className="pt-6">
          <Label className="text-red-500">Danger Zone</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Deleting a workspace is permanent and cannot be undone.
          </p>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full"
          >
            {isDeleting ? "Deleting..." : "Delete Workspace"}
          </Button>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
