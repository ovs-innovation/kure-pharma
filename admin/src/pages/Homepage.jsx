import { Button, Card, CardBody, Input } from "@windmill/react-ui";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import PageTitle from "@/components/Typography/PageTitle";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import Loading from "@/components/preloader/Loading";
import useHomepageSubmit from "@/hooks/useHomepageSubmit";
import Uploader from "@/components/image-uploader/Uploader";

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label}
    </label>
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder = "" }) => (
  <Input className="h-10" value={value || ""} onChange={onChange} placeholder={placeholder} />
);

const Homepage = () => {
  const {
    settings,
    loading,
    isSubmitting,
    onSubmit,
    updateNested,
    updateListItem,
    addListItem,
    removeListItem,
    updateHeroSlide,
    addHeroSlide,
    removeHeroSlide,
  } = useHomepageSubmit();

  if (loading || !settings) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <PageTitle>Homepage Hero Settings</PageTitle>

      <form onSubmit={onSubmit}>
        <Card className="mb-5">
          <CardBody className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-gray-700 dark:text-gray-300">Enable Hero Slider:</span>
                <SwitchToggle
                  processOption={settings.hero?.enabled}
                  handleProcess={(v) => updateNested("hero", "enabled", v)}
                />
              </div>
              <Button type="button" size="small" onClick={addHeroSlide} className="w-full sm:w-auto justify-center">
                <FiPlus className="mr-1" /> Add Slide
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 md:p-5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl">
              <Field label="Contact Phone Number">
                <TextInput
                  value={settings.hero?.phone}
                  onChange={(e) => updateNested("hero", "phone", e.target.value)}
                  placeholder="+91 99119 72234"
                />
              </Field>
              <Field label="Contact WhatsApp Number (Digits only, e.g. 919911972234)">
                <TextInput
                  value={settings.hero?.whatsapp}
                  onChange={(e) => updateNested("hero", "whatsapp", e.target.value)}
                  placeholder="919911972234"
                />
              </Field>
            </div>

            <div className="space-y-6">
              {(settings.hero?.slides || []).map((slide, index) => (
                <Card key={index} className="border border-gray-150 dark:border-gray-700 rounded-2xl">
                  <CardBody className="p-4 md:p-5">
                    <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
                      <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">Slide {index + 1}</h4>
                      <button type="button" onClick={() => removeHeroSlide(index)} className="hover:bg-red-55 p-1.5 rounded-lg dark:hover:bg-red-900/20">
                        <FiTrash2 className="text-red-500 w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        ["tagline", "Tagline"],
                        ["titleLine1", "Title Line 1"],
                        ["titleHighlight", "Highlighted Text"],
                        ["titleLine2", "Title Line 2"],
                        ["subtitle", "Subtitle"],
                        ["cities", "Locations / Cities Displayed"],
                      ].map(([key, label]) => (
                        <div key={key} className={key === "subtitle" || key === "cities" ? "md:col-span-2" : ""}>
                          <Field label={label}>
                            <TextInput
                              value={slide[key]}
                              onChange={(e) => updateHeroSlide(index, key, e.target.value)}
                            />
                          </Field>
                        </div>
                      ))}
                      
                      <div className="md:col-span-2 mt-2">
                        <Field label="Background Image">
                          <Uploader
                            imageUrl={slide.bgImage}
                            setImageUrl={(val) => updateHeroSlide(index, "bgImage", val)}
                            folder="homepage"
                          />
                        </Field>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="h-12 px-8">
                {isSubmitting ? "Saving..." : "Save Homepage Settings"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </>
  );
};

export default Homepage;
