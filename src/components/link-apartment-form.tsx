"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
} from "@sr2/components/ui/form";
import { Input } from "@sr2/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sr2/components/ui/select";

import { Button } from "./ui/button";

type Building = {
  id: string;
  number: number | null;
  title: string | null;
  liter: string | null;
  active: boolean | null;
};

export const LinkApartmentForm = ({ buildings }: { buildings: Building[] }) => {
  const formSchema = z.object({
    username: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex flex-row w-full gap-4">
      <div className="flex-1/2 rounded-l-4xl overflow-hidden">
        <Image
          src="/register-apartments.png"
          alt="link-apartment"
          width={500}
          height={500}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1/2">
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormControl>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Строение" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </div>
          <FormItem>
            <FormControl className="ring-0 focus:ring-0 focus-visible:ring-0">
              <Input
                {...form.register("username")}
                className="ring-0 focus:ring-0"
              />
            </FormControl>
          </FormItem>
          <Button type="submit">Привязать</Button>
        </form>
      </Form>
    </div>
  );
};
