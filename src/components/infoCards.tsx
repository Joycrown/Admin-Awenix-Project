function InfoCards({
  heading,
  icon,
  gradeColor,
  value,
}: {
  heading: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  gradeColor: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-1 xs:min-w-[240px] justify-between gap-3 bg-white rounded-xl px-4 py-4">
      <div className="flex flex-col gap-3">
        <h5 className="capitalize text-sm">{heading}</h5>
        <span className="font-medium text-lg">{value}</span>
      </div>
      <div
        style={{ backgroundColor: gradeColor }}
        className="rounded-xl w-11 h-11 flex items-center justify-center"
      >
        {icon}
      </div>
    </div>
  );
}

export default InfoCards;
