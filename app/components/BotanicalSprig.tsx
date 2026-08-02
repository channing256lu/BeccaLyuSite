type BotanicalSprigProps = {
  className: string;
};

export function BotanicalSprig({ className }: BotanicalSprigProps) {
  return (
    <span className={`botanical-sprig ${className}`} aria-hidden="true">
      <span className="botanical-stem" />
      <span className="botanical-leaf botanical-leaf-one" />
      <span className="botanical-leaf botanical-leaf-two" />
      <span className="botanical-leaf botanical-leaf-three" />
      <span className="botanical-leaf botanical-leaf-four" />
    </span>
  );
}
