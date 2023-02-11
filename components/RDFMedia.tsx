import { Label } from "@radix-ui/react-label"
import { CameraIcon } from '@radix-ui/react-icons';
import { RDFControlledInputProps } from "./RDF"
import { RDFErrorMessage, RDFHelpText } from "./RDFHelpers"
import { Controller } from "react-hook-form"
import prettyBytes from 'pretty-bytes';
import { useRef, useState } from "react";

export type RDFMediaProps = RDFControlledInputProps & {}

/**
 *
 * @props see {@link RDFMediaProps}
 * @returns text field with given options
 */
export const RDFMedia = ({
  name,
  label,
  helper,
  options,
  control,
  errors,
}: RDFMediaProps) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string>(null);
  const [media, setMedia] = useState<File>(null);
  const fileInputRef = useRef(null);
  const labelClasses = ['label', `label-${name}`]
  const inputClasses = ['input', `input-${name}`]
  const error = errors[name]
  if (error) {
    inputClasses.push('input-has-error')
    labelClasses.push('label-has-error')
  }

  const render = ({ field }) => {

    const handleFileInputChange = (e: unknown) => {
      // TODO: a lot more
      const [file] = fileInputRef.current.files;
      setPreviewImageUrl(URL.createObjectURL(file));
      setMedia(file);
      field.onChange(file);
    }

    const handleRemoveMedia = () => {
      setPreviewImageUrl(null);
      setMedia(null)
      field.onChange(null);
    }

    return (
      <div className={`field field-${name}`}>
        <div className="media-wrap">
          <Label className={labelClasses.join(' ')} htmlFor={name}>
            {label}
          </Label>
          <RDFErrorMessage error={error} />
          <RDFHelpText helper={helper} />
          <div className="media-target">
            {previewImageUrl
              ? <div className="media-preview" style={{ backgroundImage: `url(${previewImageUrl})`}} />
              : null
            }
            {!previewImageUrl
              ? <div className="media-drop">
                  <CameraIcon width={35} height={35} />
                  <p>Click or drop files to upload</p>
                </div>
              : null
            }
            <input
              type="file"
              id={name}
              name={name}
              className="media-input"
              onChange={handleFileInputChange}
              ref={fileInputRef}
            />
          </div>
        </div>
        {previewImageUrl
            ? <div className="media-info">
                <span className="file-name">{media.name}</span>
                <span className="file-type">{media.type}</span>
                <span className="file-size">{prettyBytes(media.size)}</span>
                <a href="javascript:void(0)" className="remove-media" onClick={handleRemoveMedia}>Remove media</a>
              </div>
            : null
        }
      </div>
    )
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={options}
      render={render}
    />
  )
}
