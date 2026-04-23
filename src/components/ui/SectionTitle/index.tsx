import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  title: string;
  classes?: string;
}

const Index: FC<Props> = ({ title, classes, ...props }) => {
  return (
    <h2 className={`text-[7.5vw] font-extrabold leading-[100%] md:text-[13vw] md:text-center ${classes}`} {...props}>
      {title}
    </h2>
  );
};
export default Index;
