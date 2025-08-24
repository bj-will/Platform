import { h } from "preact";
import * as icons from '@tabler/icons-preact';

interface ProjectModalProps {
  project?: {
    id: number;
    name: string;
    slug: string;
    twitter?: string;
    discord?: string;
    site?: string;
  };
  form: { name: string; slug: string; twitter: string; discord: string; site: string };
  setForm: (f: any) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function ProjectModal({ form, setForm, onSave, onClose }: ProjectModalProps) {
  return (
    <div class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{form.name ? "Edit Project" : "Add Project"}</h5>
            <button type="button" class="btn-close" onClick={onClose}></button>
          </div>
          <div class="modal-body d-flex flex-column gap-2">

  <InputRow
    label="Slug:"
    value={form.slug}
    onChange={() => {}} // No change handler for slug
  />
   <InputRow
    label="Name:"
    value={form.name}
    onChange={e => setForm({ ...form, name: e.target.value })}
  />


  <InputRow
    label="Twitter:"
    value={form.twitter}
    onChange={e => setForm({ ...form, twitter: e.target.value })}
    buttonLink={form.twitter ? `https://x.com/${form.twitter}` : null}
    icon={icons.IconBrandTwitter}
  />

  <InputRow
    label="Discord:"
    value={form.discord}
    onChange={e => setForm({ ...form, discord: e.target.value })}
    buttonLink={form.discord ? `https://discord.gg/${form.discord}` : null}
    icon={icons.IconBrandDiscord}
  />

  <InputRow
    label="Site:"
    value={form.site}
    onChange={e => setForm({ ...form, site: e.target.value })}
    buttonLink={form.site ? form.site : null} // Use the site URL directly
    icon={icons.IconWorld}
  />
</div>

          <div class="modal-footer">
            <button class="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
            <button class="btn btn-primary" onClick={onSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputRow({ label, value, onChange, buttonLabel, buttonLink, icon }) {
              const Icon = icon || icons.IconWorld

  return (
    <FormRow label={label}>
      <div class="d-flex align-items-center flex-grow-1">
        <input
          class="form-control"
          value={value}
          onInput={onChange}
          readOnly={label === "Slug:" && value !== ""} // Make slug read-only
        />
        {buttonLink && (
          <button
            class="btn btn-link"
            onClick={() => window.open(buttonLink, "_blank")}
            disabled={!value} // Disable button if the field is empty
          >
          <Icon size={20} class="text-white"  />

          </button>
        )}
      </div>
    </FormRow>
  );
}

function FormRow({ label, children }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <label className="col-form-label" style={{ width: "90px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
