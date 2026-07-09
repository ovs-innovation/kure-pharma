import { useEffect, useState } from "react";

import SettingServices from "@/services/SettingServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useHomepageSubmit = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await SettingServices.getKureHomepageSetting();
        setSettings(res);
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateSection = (sectionKey, value) => {
    setSettings((prev) => ({
      ...prev,
      [sectionKey]: value,
    }));
  };

  const updateNested = (sectionKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev?.[sectionKey],
        [field]: value,
      },
    }));
  };

  const updateListItem = (sectionKey, index, field, value) => {
    setSettings((prev) => {
      const list = [...(prev?.[sectionKey]?.items || [])];
      list[index] = { ...list[index], [field]: value };
      return {
        ...prev,
        [sectionKey]: {
          ...prev?.[sectionKey],
          items: list,
        },
      };
    });
  };

  const addListItem = (sectionKey, template) => {
    setSettings((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev?.[sectionKey],
        items: [...(prev?.[sectionKey]?.items || []), { ...template }],
      },
    }));
  };

  const removeListItem = (sectionKey, index) => {
    setSettings((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev?.[sectionKey],
        items: (prev?.[sectionKey]?.items || []).filter((_, i) => i !== index),
      },
    }));
  };

  const updateHeroSlide = (index, field, value) => {
    setSettings((prev) => {
      const slides = [...(prev?.hero?.slides || [])];
      slides[index] = { ...slides[index], [field]: value };
      return {
        ...prev,
        hero: { ...prev.hero, slides },
      };
    });
  };

  const addHeroSlide = () => {
    setSettings((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: [
          ...(prev?.hero?.slides || []),
          {
            tagline: "",
            titleLine1: "",
            titleHighlight: "",
            titleLine2: "",
            subtitle: "",
            bgImage: "",
          },
        ],
      },
    }));
  };

  const removeHeroSlide = (index) => {
    setSettings((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        slides: (prev?.hero?.slides || []).filter((_, i) => i !== index),
      },
    }));
  };

  const updateNestedObject = (sectionKey, objectKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev?.[sectionKey],
        [objectKey]: {
          ...prev?.[sectionKey]?.[objectKey],
          [field]: value,
        },
      },
    }));
  };

  const updateFooterBadge = (index, value) => {
    setSettings((prev) => {
      const badges = [...(prev?.footer?.badges || [])];
      badges[index] = value;
      return {
        ...prev,
        footer: { ...prev?.footer, badges },
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await SettingServices.updateKureHomepageSetting({
        setting: settings,
      });
      notifySuccess(res.message);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    settings,
    loading,
    isSubmitting,
    onSubmit,
    updateSection,
    updateNested,
    updateListItem,
    addListItem,
    removeListItem,
    updateHeroSlide,
    addHeroSlide,
    removeHeroSlide,
    updateNestedObject,
    updateFooterBadge,
  };
};

export default useHomepageSubmit;
