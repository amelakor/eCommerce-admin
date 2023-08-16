"use client";
import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/stores", data);
            window.location.assign(`${response.data.id}`);
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const { isOpen, onClose } = storeModal;

    return (
        <Modal
            title="Create store"
            description="Add a new store to manage products and categories"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="space-y-4 py-4 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="E-Commerce"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.name?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <div className="pt-4 space-x-2 flex items-center justify-end w-full">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    );
};
