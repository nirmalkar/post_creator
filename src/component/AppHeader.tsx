import React from "react";
import { Layout } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  description?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "Post Creator",
  description = "Create stunning Instagram learning content with multiple templates"
}) => {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
        <Layout size={32} />
        {title}
      </h1>
      <p className="text-gray-400 mb-8">
        {description}
      </p>
    </>
  );
};

export default AppHeader;
