"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building } from "lucide-react";
import { type Session } from "next-auth";
import { z } from "zod";

import { submitLinkApartment } from "~/app/me/link-apartment/actions";
import { Form, FormControl, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { Button } from "./ui/button";
import { ButtonGroup, ButtonGroupItem } from "./ui/button-group";

type Building = {
  id: string;
  number: number | null;
  title: string | null;
  liter: string | null;
  active: boolean | null;
  maxApartmentNumber?: number | null;
};

export const LinkApartmentForm = ({
  buildings,
  usedApartments,
  user,
}: {
  buildings: Building[];
  usedApartments: { buildingId: string; apartmentNumber: number }[];
  user: Session;
}) => {
  const onSubmit = async (values: {
    buildingId: string;
    apartmentNumber: number;
  }) => {
    if (!user?.user) {
      return;
    }
    const result = await submitLinkApartment({
      ...values,
      userId: user.user.id,
    });

    if (result.success) {
      console.log("success");
      // toast.success("Квартира привязана");
      // router.push("/me");
    }
  };

  const formSchema = z
    .object({
      buildingId: z.string().min(1, "Выберите строение"),
      apartmentNumber: z
        .number({ message: "Введите номер квартиры" })
        .positive("Номер должен быть положительным")
        .int("Номер должен быть целым числом")
        .min(1, "Номер должен быть больше 0"),
    })
    .refine(
      (data) =>
        !usedApartments.some(
          ({ buildingId, apartmentNumber }) =>
            buildingId === data.buildingId &&
            apartmentNumber === data.apartmentNumber,
        ),
      {
        path: ["apartmentNumber"],
        message: "Этот номер уже занят",
      },
    )
    .refine(
      (data) => {
        const maxNumber =
          buildings.find((b) => b.id === data.buildingId)?.maxApartmentNumber ??
          Infinity;
        return data.apartmentNumber <= maxNumber;
      },
      {
        path: ["apartmentNumber"],
        message: "Превышен максимальный номер квартиры в этом здании",
      },
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      apartmentNumber: undefined,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = form;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-row gap-4">
      <Form {...form}>
        <form
          onSubmit={handleSubmit((data) => onSubmit?.(data))}
          className="flex w-full flex-col gap-4"
        >
          <div className="flex flex-1 flex-col gap-4">
            <FormItem>
              <FormControl>
                <ButtonGroup
                  color="primary"
                  className="flex flex-row gap-4"
                  onValueChange={(value) => {
                    setValue("buildingId", value, { shouldValidate: true });
                    void trigger("buildingId");
                    void trigger("apartmentNumber");
                  }}
                >
                  {buildings.map((building) => (
                    <ButtonGroupItem
                      key={building.id}
                      className="flex-1"
                      value={building.id}
                      id={building.id}
                      label={building.title ?? ""}
                      icon={<Building />}
                    />
                  ))}
                </ButtonGroup>
              </FormControl>
              {errors.buildingId && (
                <p className="text-sm text-red-500">
                  {errors.buildingId.message}
                </p>
              )}
            </FormItem>

            <FormItem>
              <FormControl>
                <Input
                  {...register("apartmentNumber", {
                    valueAsNumber: true,
                    onChange: () => void trigger("apartmentNumber"),
                  })}
                  className="focus-visible::ring-0 h-[66px] text-center ring-0 placeholder:font-normal focus:ring-0 md:text-2xl"
                  type="number"
                  placeholder="Номер квартиры"
                />
              </FormControl>
              {errors.apartmentNumber && (
                <p className="text-sm text-red-500">
                  {errors.apartmentNumber.message}
                </p>
              )}
            </FormItem>

            <Button type="submit" disabled={!form.formState.isValid}>
              Привязать
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
