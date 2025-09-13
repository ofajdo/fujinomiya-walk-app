"use client";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export function H1({ children, className }: Props) {
  return (
    <h1 className={"text-2xl font-bold py-1 px-2 text-center " + className}>
      {children}
    </h1>
  );
}
