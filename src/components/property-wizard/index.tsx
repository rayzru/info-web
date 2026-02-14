"use client";

import { useState } from "react";

import { ChevronLeft, Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { BuildingForm, FormWrapper, PropertyForm, RoleForm, TypeForm } from "./forms";
import { StepHeader } from "./step-header";

type PropertyType = "apartment" | "parking";
type WizardStep = "type" | "building" | "property" | "role" | "completed";

interface Building {
  id: string;
  number: number | null;
  title: string | null;
  liter: string | null;
  entrances: {
    id: string;
    entranceNumber: number;
    floors: {
      id: string;
      floorNumber: number;
      apartments: {
        id: string;
        number: string;
        type: string;
      }[];
    }[];
  }[];
  parkings: {
    id: string;
    name: string;
    floors: {
      id: string;
      floorNumber: number;
      spots: {
        id: string;
        number: string;
        type: string;
      }[];
    }[];
  }[];
}

interface PropertyWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buildings: Building[];
  existingClaims: Array<{ apartmentId?: string; parkingSpotId?: string }>;
  onSubmit: (data: {
    type: PropertyType;
    buildingId: string;
    propertyId: string;
    role: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function PropertyWizard({
  open,
  onOpenChange,
  buildings,
  existingClaims,
  onSubmit,
  isSubmitting,
}: PropertyWizardProps) {
  const [step, setStep] = useState<WizardStep>("type");
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [role, setRole] = useState("");

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);

  // Step configuration
  const steps: Array<{
    key: WizardStep;
    label: string;
    getValue: () => string;
  }> = [
    {
      key: "type",
      label: "Тип",
      getValue: () =>
        propertyType === "apartment" ? "Квартира" : propertyType === "parking" ? "Парковка" : "",
    },
    {
      key: "building",
      label: "Строение",
      getValue: () => {
        if (!selectedBuildingId) return "";
        const building = buildings.find((b) => b.id === selectedBuildingId);
        return building
          ? `${building.title ?? `Строение ${building.number}`}${building.liter ? ` (${building.liter})` : ""}`
          : "";
      },
    },
    {
      key: "property",
      label: propertyType === "apartment" ? "Квартира" : "Парковка",
      getValue: () => {
        if (!selectedPropertyId || !selectedBuilding) return "";
        if (propertyType === "apartment") {
          const apt = selectedBuilding.entrances
            .flatMap((e) =>
              e.floors.flatMap((f) =>
                f.apartments.map((a) => ({
                  ...a,
                  entrance: e.entranceNumber,
                  floor: f.floorNumber,
                }))
              )
            )
            .find((a) => a.id === selectedPropertyId);
          return apt ? `Подъезд ${apt.entrance}, Этаж ${apt.floor}, №${apt.number}` : "";
        } else {
          const spot = selectedBuilding.parkings[0]?.floors
            .flatMap((f) =>
              f.spots.map((s) => ({
                ...s,
                floor: f.floorNumber,
              }))
            )
            .find((s) => s.id === selectedPropertyId);
          return spot ? `Этаж ${spot.floor}, №${spot.number}` : "";
        }
      },
    },
    {
      key: "role",
      label: "Роль",
      getValue: () => {
        if (!role) return "";
        const roleLabels: Record<string, string> = {
          ApartmentOwner: "Собственник",
          ApartmentResident: "Проживающий",
          ParkingOwner: "Собственник",
          ParkingResident: "Арендатор",
        };
        return roleLabels[role] ?? role;
      },
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleNext = () => {
    if (step === "type" && propertyType) {
      setStep("building");
    } else if (step === "building" && selectedBuildingId) {
      setStep("property");
    } else if (step === "property" && selectedPropertyId) {
      setStep("role");
    }
  };

  const handleBack = () => {
    if (step === "completed") {
      setStep("role");
    } else if (step === "role") {
      setStep("property");
      setRole("");
    } else if (step === "property") {
      setStep("building");
      setSelectedPropertyId("");
    } else if (step === "building") {
      setStep("type");
      setSelectedBuildingId("");
    }
  };

  const handleSubmit = async () => {
    if (!propertyType || !selectedBuildingId || !selectedPropertyId || !role) {
      return;
    }

    await onSubmit({
      type: propertyType,
      buildingId: selectedBuildingId,
      propertyId: selectedPropertyId,
      role,
    });

    // Reset
    setStep("type");
    setPropertyType(null);
    setSelectedBuildingId("");
    setSelectedPropertyId("");
    setRole("");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setStep("type");
      setPropertyType(null);
      setSelectedBuildingId("");
      setSelectedPropertyId("");
      setRole("");
      onOpenChange(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "type":
        return "Выберите тип недвижимости";
      case "building":
        return "Выберите строение";
      case "property":
        return propertyType === "apartment" ? "Выберите квартиру" : "Выберите парковочное место";
      case "role":
        return "Укажите вашу роль";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>Добавить недвижимость</DialogTitle>
          <DialogDescription>{getStepTitle()}</DialogDescription>
        </DialogHeader>

        {/* Steps and Forms */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-0">
            {steps.map((stepInfo, index) => {
              const isActive = stepInfo.key === step;
              const isCompleted = step === "completed" ? true : index < currentStepIndex;
              const stepValue = isCompleted ? stepInfo.getValue() : "";

              // Handler to navigate to this step when clicked
              const handleStepClick = () => {
                if (isCompleted) {
                  setStep(stepInfo.key);
                }
              };

              return (
                <div key={stepInfo.key}>
                  {/* ЛИНИЯ = НОМЕР / ПОДПИСЬ / ВЫБРАННОЕ ЗНАЧЕНИЕ */}
                  <div onClick={handleStepClick} className={isCompleted ? "cursor-pointer" : ""}>
                    <StepHeader
                      number={index + 1}
                      label={stepInfo.label}
                      value={stepValue}
                      isActive={isActive}
                      isCompleted={isCompleted}
                    />
                  </div>

                  {/* ФОРМА (если активна) */}
                  <FormWrapper isActive={isActive}>
                    {stepInfo.key === "type" && (
                      <TypeForm
                        value={propertyType}
                        onChange={(value) => {
                          setPropertyType(value);
                          setStep("building");
                        }}
                      />
                    )}

                    {stepInfo.key === "building" && (
                      <BuildingForm
                        buildings={buildings}
                        value={selectedBuildingId}
                        onChange={(value) => {
                          setSelectedBuildingId(value);
                          setStep("property");
                        }}
                      />
                    )}

                    {stepInfo.key === "property" && selectedBuilding && propertyType && (
                      <PropertyForm
                        type={propertyType}
                        building={selectedBuilding}
                        value={selectedPropertyId}
                        onChange={(value) => {
                          setSelectedPropertyId(value);
                          setStep("role");
                        }}
                        existingClaims={existingClaims}
                      />
                    )}

                    {stepInfo.key === "role" && propertyType && (
                      <RoleForm
                        propertyType={propertyType}
                        value={role}
                        onChange={(value) => {
                          setRole(value);
                          setStep("completed");
                        }}
                      />
                    )}
                  </FormWrapper>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          {step !== "type" && (
            <Button variant="ghost" onClick={handleBack} disabled={isSubmitting}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          )}
          {step === "type" && <div />}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Отмена
            </Button>

            {step === "completed" && (
              <Button onClick={handleSubmit} disabled={!role || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Отправить заявку
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
