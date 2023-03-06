import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from "@sinclair/typebox";
import { requireRole, UUID } from "../../types";

import * as m from './model';
import * as s from './service';
import * as t from './types';

const plugin: FastifyPluginAsyncTypebox = async (server, opts) => {
  server.get('/', {

  }, async (req, rep) => {

  });

  server.get('/:id', {

  }, async (req, rep) => {

  });

  server.post('/', {

  }, async (req, rep) => {

  });

  server.delete('/:id', {

  }, async (req, rep) => {

  });
}

export default plugin;