
import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  rounded?: boolean;
  animate?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  count = 1,
  height = "h-4",
  width = "w-full",
  rounded = false,
  animate = true,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            height,
            width,
            rounded && "rounded-full",
            animate && "animate-pulse",
            className
          )}
        />
      ))}
    </>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("p-4 space-y-4 border rounded-md shadow-sm bg-white", className)}>
      <SkeletonLoader height="h-6" width="w-2/3" />
      <SkeletonLoader count={3} className="my-2" />
      <div className="flex gap-2 mt-4">
        <SkeletonLoader width="w-1/4" height="h-8" />
        <SkeletonLoader width="w-1/4" height="h-8" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center gap-4">
        <SkeletonLoader height="h-16" width="w-16" rounded />
        <div className="space-y-2">
          <SkeletonLoader height="h-6" width="w-48" />
          <SkeletonLoader height="h-4" width="w-32" />
        </div>
      </div>
      <div className="space-y-4">
        <SkeletonLoader height="h-4" width="w-full" />
        <SkeletonLoader height="h-4" width="w-full" />
        <SkeletonLoader height="h-4" width="w-3/4" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};
