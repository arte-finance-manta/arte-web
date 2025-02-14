import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Image
      src={theme === "dark" ? "/logo_white.png" : "/logo_black.png"}
      width={17}
      height={17}
      className="p-2 w-fit min-w-10"
      alt="logo"
    />
  );
}