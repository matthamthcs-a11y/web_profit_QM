"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Database } from "@/lib/supabase/database.types";

type Badge = Database["public"]["Tables"]["feature_badges"]["Row"];

export function AdminProductBadgeSelector({
  availableBadges,
  initialSelectedIds,
}: {
  availableBadges: Badge[];
  initialSelectedIds: string[];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  const handleSelect = (id: string) => {
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const handleMoveLeft = (index: number) => {
    if (index > 0) {
      const newIds = [...selectedIds];
      const temp = newIds[index - 1];
      newIds[index - 1] = newIds[index];
      newIds[index] = temp;
      setSelectedIds(newIds);
    }
  };

  const handleMoveRight = (index: number) => {
    if (index < selectedIds.length - 1) {
      const newIds = [...selectedIds];
      const temp = newIds[index + 1];
      newIds[index + 1] = newIds[index];
      newIds[index] = temp;
      setSelectedIds(newIds);
    }
  };

  const selectedBadges = selectedIds
    .map((id) => availableBadges.find((b) => b.id === id))
    .filter((b): b is Badge => Boolean(b));

  const unselectedBadges = availableBadges.filter(
    (b) => !selectedIds.includes(b.id)
  );

  return (
    <div className="grid gap-8">
      {/* Hidden inputs to preserve order for formData */}
      {selectedIds.map((id) => (
        <input key={`hidden-${id}`} type="hidden" name="feature_badges[]" value={id} />
      ))}

      {/* Selected Badges Section */}
      <div className="grid gap-3">
        <h4 className="text-sm font-bold text-ink">Huy hiệu đã chọn</h4>
        <div className="flex flex-wrap gap-4 min-h-[100px] items-start p-4 rounded-lg border-2 border-dashed border-line bg-slate-50/50">
          {selectedBadges.length === 0 && (
            <div className="w-full text-center text-sm font-medium text-muted py-4">
              Chưa có huy hiệu nào được chọn.
            </div>
          )}
          {selectedBadges.map((badge, index) => (
            <div
              key={badge.id}
              className="flex flex-col items-center justify-between gap-3 rounded-lg border border-brand-red bg-brand-red/5 p-3 w-32 shadow-sm transition-all"
            >
              <div className="h-10 w-full flex items-center justify-center">
                {badge.image_path ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={badge.image_path}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 rounded"></div>
                )}
              </div>
              <div className="flex items-center justify-between w-full border-t border-brand-red/20 pt-2">
                <button
                  type="button"
                  onClick={() => handleMoveLeft(index)}
                  disabled={index === 0}
                  className="p-1 text-brand-red hover:bg-brand-red/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Dịch trái"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(badge.id)}
                  className="p-1 text-red-600 hover:bg-red-600/10 rounded"
                  title="Xóa"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveRight(index)}
                  disabled={index === selectedBadges.length - 1}
                  className="p-1 text-brand-red hover:bg-brand-red/10 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Dịch phải"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Badges Section */}
      <div className="grid gap-3">
        <h4 className="text-sm font-bold text-ink">Huy hiệu có sẵn (Click để chọn)</h4>
        <div className="flex flex-wrap gap-4 p-4 rounded-lg border border-line bg-white">
          {unselectedBadges.length === 0 && (
            <div className="w-full text-center text-sm font-medium text-muted py-4">
              Không còn huy hiệu nào để chọn.
            </div>
          )}
          {unselectedBadges.map((badge) => (
            <button
              key={badge.id}
              type="button"
              onClick={() => handleSelect(badge.id)}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-line p-3 w-32 cursor-pointer transition-colors hover:border-ink hover:bg-slate-50"
            >
              <div className="h-10 w-full flex items-center justify-center">
                {badge.image_path ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={badge.image_path}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 rounded"></div>
                )}
              </div>
              <span className="text-xs font-bold text-muted">Thêm +</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
