import { Button, Card, CardBody, Input, Textarea } from "@windmill/react-ui";
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
    updateNestedObject,
    updateFooterBadge,
    updateHeroSlide,
    addHeroSlide,
    removeHeroSlide,
  } = useHomepageSubmit();

  if (loading || !settings) {
    return <Loading loading={loading} />;
  }

  return (
    <>
      <PageTitle>Homepage & Footer</PageTitle>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 -mt-4">
        Edit the homepage hero slider and website footer content.
      </p>

      <form onSubmit={onSubmit}>
        <Card className="mb-5">
          <CardBody className="p-4 md:p-6">
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-gray-100 mb-1">
              Hero Slider
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Main banner at the top of the homepage.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-gray-700 dark:text-gray-300">
                  Show Hero:
                </span>
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
              <Field label="Contact Phone">
                <TextInput
                  value={settings.hero?.phone}
                  onChange={(e) => updateNested("hero", "phone", e.target.value)}
                  placeholder="+91 99119 72234"
                />
              </Field>
              <Field label="WhatsApp Number (digits only)">
                <TextInput
                  value={settings.hero?.whatsapp}
                  onChange={(e) => updateNested("hero", "whatsapp", e.target.value)}
                  placeholder="919911972234"
                />
              </Field>
              <Field label="Primary Button Text">
                <TextInput
                  value={settings.hero?.ctaPrimary?.text}
                  onChange={(e) =>
                    updateNestedObject("hero", "ctaPrimary", "text", e.target.value)
                  }
                  placeholder="View Full Product Range"
                />
              </Field>
              <Field label="Primary Button Link">
                <TextInput
                  value={settings.hero?.ctaPrimary?.link}
                  onChange={(e) =>
                    updateNestedObject("hero", "ctaPrimary", "link", e.target.value)
                  }
                  placeholder="/products"
                />
              </Field>
              <Field label="Enquiry Button Text">
                <TextInput
                  value={settings.hero?.ctaSecondary?.text}
                  onChange={(e) =>
                    updateNestedObject("hero", "ctaSecondary", "text", e.target.value)
                  }
                  placeholder="Send Enquiry"
                />
              </Field>
            </div>

            <div className="space-y-6">
              {(settings.hero?.slides || []).map((slide, index) => (
                <Card key={index} className="border border-gray-150 dark:border-gray-700 rounded-2xl">
                  <CardBody className="p-4 md:p-5">
                    <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
                      <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-100">
                        Slide {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeHeroSlide(index)}
                        className="hover:bg-red-55 p-1.5 rounded-lg dark:hover:bg-red-900/20"
                      >
                        <FiTrash2 className="text-red-500 w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        ["tagline", "Tagline (small text above title)"],
                        ["titleLine1", "Title Line 1"],
                        ["titleHighlight", "Highlighted Text (bold)"],
                        ["titleLine2", "Title Line 2"],
                        ["subtitle", "Description"],
                        ["cities", "Cities / Locations"],
                      ].map(([key, label]) => (
                        <div
                          key={key}
                          className={key === "subtitle" || key === "cities" ? "md:col-span-2" : ""}
                        >
                          <Field label={label}>
                            <TextInput
                              value={slide[key]}
                              onChange={(e) => updateHeroSlide(index, key, e.target.value)}
                            />
                          </Field>
                        </div>
                      ))}

                      <div className="md:col-span-2 mt-2">
                        <Field label="Hero Image">
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
          </CardBody>
        </Card>

        <Card className="mb-5">
          <CardBody className="p-4 md:p-6">
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-gray-100 mb-1">
              Footer
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Contact info and text shown at the bottom of every page.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Field label="About Text">
                  <Textarea
                    className="border text-sm block w-full"
                    rows="3"
                    value={settings.footer?.description || ""}
                    onChange={(e) => updateNested("footer", "description", e.target.value)}
                    placeholder="Short company description"
                  />
                </Field>
              </div>

              <Field label="Badge 1">
                <TextInput
                  value={settings.footer?.badges?.[0]}
                  onChange={(e) => updateFooterBadge(0, e.target.value)}
                  placeholder="Quality Assured"
                />
              </Field>
              <Field label="Badge 2">
                <TextInput
                  value={settings.footer?.badges?.[1]}
                  onChange={(e) => updateFooterBadge(1, e.target.value)}
                  placeholder="Pan-India"
                />
              </Field>

              <Field label="Phone Number">
                <TextInput
                  value={settings.footer?.phone}
                  onChange={(e) => updateNested("footer", "phone", e.target.value)}
                  placeholder="+91 99119 72234"
                />
              </Field>
              <Field label="Phone Link (tel:)">
                <TextInput
                  value={settings.footer?.phoneHref}
                  onChange={(e) => updateNested("footer", "phoneHref", e.target.value)}
                  placeholder="tel:+919911972234"
                />
              </Field>

              <Field label="Email">
                <TextInput
                  value={settings.footer?.email}
                  onChange={(e) => updateNested("footer", "email", e.target.value)}
                  placeholder="Kure.export@gmail.com"
                />
              </Field>
              <Field label="Working Hours">
                <TextInput
                  value={settings.footer?.hours}
                  onChange={(e) => updateNested("footer", "hours", e.target.value)}
                  placeholder="Mon–Sat: 10 AM – 7 PM IST"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Address">
                  <Textarea
                    className="border text-sm block w-full"
                    rows="3"
                    value={settings.footer?.address || ""}
                    onChange={(e) => updateNested("footer", "address", e.target.value)}
                    placeholder="Full office address"
                  />
                </Field>
              </div>

              <Field label="WhatsApp Link">
                <TextInput
                  value={settings.footer?.whatsappUrl}
                  onChange={(e) => updateNested("footer", "whatsappUrl", e.target.value)}
                  placeholder="https://wa.me/919911972234"
                />
              </Field>
              <Field label="Facebook Link">
                <TextInput
                  value={settings.footer?.facebookUrl}
                  onChange={(e) => updateNested("footer", "facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Copyright Line">
                  <TextInput
                    value={settings.footer?.copyright}
                    onChange={(e) => updateNested("footer", "copyright", e.target.value)}
                    placeholder="Proudly serving India."
                  />
                </Field>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end mb-8">
          <Button type="submit" disabled={isSubmitting} className="h-12 px-8">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Homepage;
