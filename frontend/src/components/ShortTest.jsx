import { useEffect } from "react";

export default function FormsAppEmbed() {
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.src = "https://forms.app/cdn/embed.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize formsapp when script loads
      new window.formsapp(
        "69220a708771255e28e67b68",
        "fullscreen",
        {},
        "https://vc3b3ipj.forms.app"
      );
    };

    document.body.appendChild(script);

    return () => {
      // Optional cleanup if component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div formsappId="69220a708771255e28e67b68"></div>
  );
}
