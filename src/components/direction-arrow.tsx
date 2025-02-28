import {
  MoveDownIcon,
  MoveDownLeftIcon,
  MoveDownRightIcon,
  MoveLeftIcon,
  MoveRightIcon,
  MoveUpIcon,
  MoveUpLeftIcon,
  MoveUpRightIcon,
} from "lucide-react";

export function DirectionArrow({
  degrees,
  className,
}: {
  degrees: number;
  className: string;
}): React.ReactNode {
  degrees = degrees % 360;
  if (degrees < 0) degrees += 360;

  if (degrees >= 337.5 || degrees < 22.5) {
    return <MoveUpIcon className={className} />;
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return <MoveUpRightIcon className={className} />;
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return <MoveRightIcon className={className} />;
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return <MoveDownRightIcon className={className} />;
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return <MoveDownIcon className={className} />;
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return <MoveDownLeftIcon className={className} />;
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return <MoveLeftIcon className={className} />;
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return <MoveUpLeftIcon className={className} />;
  } else {
    return <MoveUpIcon className={className} />;
  }
}
