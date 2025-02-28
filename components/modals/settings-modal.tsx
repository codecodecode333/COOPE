'use client'    

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSettings } from "@/hooks/use-settings";
import { Label } from '@/components/ui/label';
import { ModeToggle } from '@/components/mode-toggle'

export function SettingsModal() {
  const settings = useSettings();
  //여기 DialogTitle 안들어가 있으면 돌아가긴 하는데 오류 문구가 계속 떠서 h2를 DialogTitle로 변경했습니다.
  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle>My settings</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Coope looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
}
