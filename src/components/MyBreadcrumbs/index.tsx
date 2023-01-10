import Chip from "@mui/material/Chip";

export default function MyBreadcrumbs({ breads, ...props }: any) {
  return (
    <>
      {breads.map((b: any, index: number) => {
        return (
          <Chip
            color="primary"
            key={index}
            label={b.name}
            icon={<b.icon></b.icon>}
          />
        );
      })}
    </>
  );
}
