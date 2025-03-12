"use client";

import { memo, useMemo } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Building } from "lucide-react";
import { type Session } from "next-auth";
import { z } from "zod";

import { submitAddProperty } from "~/app/my/property/add/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type Building = {
  id: string;
  number: number | null;
  title: string | null;
  liter: string | null;
  active: boolean | null;
  maxApartmentNumber?: number | null;
  maxParkingNumber?: number | null;
};

export const AddPropertyForm = ({
  buildings,
  usedApartments = [],
  usedParkings = [],
  user,
}: {
  buildings: Building[];
  usedApartments?: { buildingId: string; number: number }[];
  usedParkings?: { buildingId: string; number: number }[];
  user: Session;
}) => {
  const memoBuildings = useMemo(() => buildings, [buildings]);
  const onSubmit = async (values: {
    buildingId: string;
    number: number;
    type: "apartment" | "parking";
  }) => {
    if (!user?.user) {
      return;
    }
    const result = await submitAddProperty({
      ...values,
      userId: user.user.id,
    });

    if (result.success) {
      console.log("success");
    }
  };

  const formSchema: z.ZodSchema = z
    .object({
      buildingId: z.string().min(1, "Выберите строение"),
      type: z.enum(["apartment", "parking"]),
      number: z
        .number({ message: "Введите номер" })
        .positive("Номер должен быть положительным")
        .int("Номер должен быть целым числом")
        .min(1, "Номер должен быть больше 0"),
    })
    .refine(
      (data) =>
        !(type === "apartment" ? usedApartments : usedParkings).some(
          ({ buildingId, number }) =>
            buildingId === data.buildingId && number === data.number,
        ),
      {
        path: ["number"],
        message: "Вы уже зарегистрировали этот вид недвижимости в этом здании",
      },
    )
    .refine(
      (data) => {
        const propKey =
          data.type === "apartment" ? "maxApartmentNumber" : "maxParkingNumber";
        const maxNumber =
          memoBuildings.find((b) => b.id === data.buildingId)?.[propKey] ??
          Infinity;
        return data.number <= maxNumber;
      },
      {
        path: ["number"],
        message: "Превышен максимальный номер квартиры в этом здании",
      },
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      number: undefined,
      type: "apartment",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const type = watch("type") as "apartment" | "parking";

  return (
    <div className="flex-row gap-4">
      <Form {...form}>
        <form
          onSubmit={handleSubmit((data) =>
            onSubmit?.(
              data as {
                buildingId: string;
                number: number;
                type: "apartment" | "parking";
              },
            ),
          )}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Notify me about...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-1"
                  >
                    {memoBuildings.map((building) => (
                      <FormItem
                        className="flex items-center space-y-0 space-x-3"
                        key={building.id}
                      >
                        <FormControl>
                          <RadioGroupItem value={building.id} />
                        </FormControl>
                        <FormLabel>{building.title}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormControl>
              <RadioGroup {...register("type")}>
                <p className="mb-2">Тип недвижимости</p>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apartment" id="apartment" />
                  <Label htmlFor="apartment">Квартира</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parking" id="parking" />
                  <Label htmlFor="parking">Парковочное место</Label>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormControl>
              <div className="mb-2 flex flex-col gap-2">
                <Label htmlFor="number">
                  <>
                    Номер{" "}
                    {type === "apartment" ? "квартиры" : "парковочного места"}
                  </>
                </Label>
                <Input
                  {...register("number", { valueAsNumber: true })}
                  type="number"
                  id="number"
                />
              </div>
            </FormControl>
            {errors.number && (
              <p className="text-sm text-red-500">
                {errors.number.message as string}
              </p>
            )}
          </FormItem>

          <Button type="submit" disabled={!form.formState.isValid}>
            Зарегистрировать недвижимость
          </Button>
        </form>
      </Form>
    </div>
  );
};
